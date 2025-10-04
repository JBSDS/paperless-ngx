from django.db import migrations, models
from django.db.models import Q, deletion


class Migration(migrations.Migration):
    dependencies = [
        ("documents", "1071_tag_tn_ancestors_count_tag_tn_ancestors_pks_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="customfield",
            name="scope",
            field=models.CharField(
                choices=[
                    ("document", "Document"),
                    ("correspondent", "Correspondent"),
                    ("both", "Document & Correspondent"),
                ],
                default="document",
                max_length=32,
                verbose_name="scope",
            ),
        ),
        migrations.AlterField(
            model_name="customfieldinstance",
            name="document",
            field=models.ForeignKey(
                blank=True,
                editable=False,
                null=True,
                on_delete=deletion.CASCADE,
                related_name="custom_fields",
                to="documents.document",
            ),
        ),
        migrations.AddField(
            model_name="customfieldinstance",
            name="correspondent",
            field=models.ForeignKey(
                blank=True,
                editable=False,
                null=True,
                on_delete=deletion.CASCADE,
                related_name="correspondent_custom_fields",
                to="documents.correspondent",
            ),
        ),
        migrations.RemoveConstraint(
            model_name="customfieldinstance",
            name="documents_customfieldinstance_unique_document_field",
        ),
        migrations.AddConstraint(
            model_name="customfieldinstance",
            constraint=models.UniqueConstraint(
                condition=Q(document__isnull=False),
                fields=("document", "field"),
                name="documents_customfieldinstance_unique_document_field",
            ),
        ),
        migrations.AddConstraint(
            model_name="customfieldinstance",
            constraint=models.UniqueConstraint(
                condition=Q(correspondent__isnull=False),
                fields=("correspondent", "field"),
                name="documents_customfieldinstance_unique_correspondent_field",
            ),
        ),
        migrations.AddConstraint(
            model_name="customfieldinstance",
            constraint=models.CheckConstraint(
                check=(
                    Q(document__isnull=False, correspondent__isnull=True)
                    | Q(document__isnull=True, correspondent__isnull=False)
                ),
                name="documents_customfieldinstance_requires_parent",
            ),
        ),
    ]
