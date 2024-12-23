# Generated by Django 5.1.2 on 2024-11-08 17:36

import django.db.models.deletion
import uuid
from django.db import migrations, models


def migrate_post_comment_id(apps, schema_editor):
    PostComment = apps.get_model('posts', 'PostComment')
    existing_ids = set(PostComment.objects.values_list('new_id', flat=True))

    for comment in PostComment.objects.all():
        new_id = uuid.uuid4()

        while new_id in existing_ids:
            new_id = uuid.uuid4()

        existing_ids.add(new_id)

        comment.new_id = new_id
        comment.save()


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0004_post_downvoted_by_post_saved_by_post_upvoted_by_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='postcomment',
            name='new_id',
            field=models.UUIDField(default=uuid.uuid4, editable=False),
        ),
        migrations.RunPython(migrate_post_comment_id),
        migrations.RemoveField(
            model_name='postcomment',
            name='id',
        ),
        migrations.RenameField(
            model_name='postcomment',
            old_name='new_id',
            new_name='id',
        ),
        migrations.AlterField(
            model_name='postcomment',
            name='id',
            field=models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='postcomment',
            name='post',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='posts.post'),
        ),
    ]
